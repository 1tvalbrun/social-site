import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Container,
  CircularProgress,
  Box,
  Button,
  Avatar,
} from '@mui/material';
import axios from 'axios';

interface Group {
  id: number;
  name: string;
  description: { raw: string; rendered: string } | string;
  avatar_urls: { full: string; thumb: string };
  cover_url?: string;
  link: string;
  last_activity: string;
  admins: {
    id: number;
    fullname: string;
    avatar: string;
  }[];
  status: string;
  members_count: string;
}

type AllGroupsPageProps = {
  onBackToFeed: () => void;
};

export default function AllGroupsPage({ onBackToFeed }: AllGroupsPageProps) {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const perPage = 8;

  const fetchGroups = async (currentPage = 1) => {
    try {
      const response = await axios.get(
        `https://stg-headlesssocial-stage.kinsta.cloud/wp-json/buddyboss/v1/groups?page=${currentPage}&per_page=${perPage}`
      );
      const newGroups = response.data;

      if (newGroups.length < perPage) {
        setHasMore(false);
      }

      if (currentPage === 1) {
        setGroups(newGroups);
      } else {
        setGroups(prev => [...prev, ...newGroups]);
      }
    } catch (error) {
      console.error('Error loading groups:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups(1);
  }, []);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchGroups(nextPage);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        All Groups
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={onBackToFeed}
        sx={{ mt: 2, fontWeight: 'bold', borderRadius: 2 }}
      >
        Back To Feed{' '}
      </Button>
      {loading && page === 1 ? (
        <Box display="flex" justifyContent="center" mt={10}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box
            display="flex"
            flexWrap="wrap"
            justifyContent="flex-start"
            gap={3}
          >
            {groups.map(group => (
              <Box
                key={group.id}
                sx={{ width: { xs: '100%', sm: '48%', md: '23%' } }}
              >
                <Card
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                  }}
                >
                  <CardMedia
                    component="img"
                    image={group.cover_url || group.avatar_urls.full}
                    alt={group.name}
                    height="140"
                  />
                  <CardContent>
                    <Typography variant="h6" component="div">
                      {group.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: 'block', mb: 1 }}
                    >
                      {group.status === 'private' ? 'Private' : 'Public'} ·
                      Group · Active{' '}
                      {new Date(group.last_activity).toLocaleDateString()}
                    </Typography>

                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      {group.admins?.[0] && (
                        <>
                          <Avatar
                            alt={group.admins[0].fullname}
                            src={group.admins[0].avatar}
                            sx={{ width: 24, height: 24 }}
                          />
                          <Typography variant="body2">
                            {group.admins[0].fullname}
                          </Typography>
                        </>
                      )}
                    </Box>

                    <Typography variant="body2" color="text.secondary">
                      {typeof group.description === 'string'
                        ? group.description.slice(0, 100)
                        : group.description?.raw?.slice(0, 100) ||
                          'No description'}
                      ...
                    </Typography>

                    <Button
                      variant="outlined"
                      fullWidth
                      size="small"
                      sx={{ mt: 2 }}
                      href={group.link}
                      target="_blank"
                    >
                      {group.status === 'private'
                        ? 'Request Access'
                        : 'View Group'}
                    </Button>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>

          {hasMore && (
            <Box textAlign="center" mt={4}>
              <Button variant="contained" onClick={handleLoadMore}>
                Load More
              </Button>
            </Box>
          )}
        </>
      )}
    </Container>
  );
}
