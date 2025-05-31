import {
  Dialog,
  DialogContent,
  Typography,
  Button,
  IconButton,
  Slide,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { TransitionProps } from '@mui/material/transitions';
import { useEffect, useState, forwardRef } from 'react';

interface Announcement {
  message: string;
  endTime: string;
  header: string;
  emoji: string;
  timerPrefix: string;
  buttonText: string;
  bgColor: string;
  textColor: string;
}

const Transition = forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const formatTime = (totalSeconds: number) => {
  const days = Math.floor(totalSeconds / (60 * 60 * 24));
  const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
  const seconds = totalSeconds % 60;

  const segments = [];
  if (days) segments.push(`${days}d`);
  if (hours) segments.push(`${hours}h`);
  if (minutes) segments.push(`${minutes}m`);
  segments.push(`${seconds}s`);

  return segments.join(' ');
};

export default function AnnouncementDialog() {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [open, setOpen] = useState(false);
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    //   const alreadySeen = sessionStorage.getItem('announcement_seen');
    //   if (alreadySeen) return;

    const fetchAnnouncement = async () => {
      const res = await fetch(
        'https://stg-headlesssocial-stage.kinsta.cloud/wp-json/wp/v2/announcement?per_page=1&orderby=date&order=desc'
      );
      const data = await res.json();
      const post = data[0];

      if (post?.meta?.is_active === '1' && post.meta.countdown_end) {
        const endTime = new Date(post.meta.countdown_end).getTime();
        const now = Date.now();
        const secondsRemaining = Math.floor((endTime - now) / 1000);

        if (secondsRemaining > 0) {
          setAnnouncement({
            message: post.content.rendered,
            endTime: post.meta.countdown_end,
            header: post.meta.announcement_header || 'Announcement',
            emoji: post.meta.announcement_emoji || '📣',
            timerPrefix: post.meta.timer_prefix || '⏳',
            buttonText: post.meta.button_text || 'Got it!',
            bgColor: post.meta.bg_color || '#0a192f',
            textColor: post.meta.text_color || '#ffffff',
          });
          setRemaining(secondsRemaining);
          setOpen(true);
          sessionStorage.setItem('announcement_seen', 'true');
        }
      }
    };

    fetchAnnouncement();
  }, []);

  useEffect(() => {
    if (!open || remaining <= 0) return;

    const timer = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setOpen(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [open, remaining]);

  const handleClose = () => setOpen(false);

  if (!announcement) return null;

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
      sx={{ zIndex: 1400 }}
    >
      <DialogContent
        sx={{
          backgroundColor: announcement.bgColor,
          color: announcement.textColor,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          textAlign: 'center',
          p: 6,
        }}
      >
        <IconButton
          edge="start"
          color="inherit"
          onClick={handleClose}
          aria-label="close"
          sx={{ position: 'absolute', top: 20, right: 20 }}
        >
          <CloseIcon />
        </IconButton>

        <Typography variant="h3" fontWeight="bold" gutterBottom>
          {announcement.emoji} {announcement.header}
        </Typography>

        <Typography
          variant="h6"
          dangerouslySetInnerHTML={{ __html: announcement.message }}
          sx={{ maxWidth: '600px', mx: 'auto', mb: 4 }}
        />

        <Typography variant="h6" sx={{ mb: 1 }}>
          {announcement.timerPrefix || '⏳'} Time remaining:
        </Typography>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '16px',
            marginBottom: '32px',
          }}
        >
          {(() => {
            const totalSeconds = remaining;
            const days = Math.floor(totalSeconds / (60 * 60 * 24));
            const hours = Math.floor(
              (totalSeconds % (60 * 60 * 24)) / (60 * 60)
            );
            const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
            const seconds = totalSeconds % 60;

            const formatUnit = (value: number) =>
              value.toString().padStart(2, '0');

            const TimerBox = (value: string, label: string) => (
              <div
                style={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  minWidth: '70px',
                }}
              >
                <Typography variant="h3" fontWeight="bold">
                  {value}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ textTransform: 'uppercase', opacity: 0.8 }}
                >
                  {label}
                </Typography>
              </div>
            );

            return (
              <>
                {TimerBox(formatUnit(days), 'Days')}
                {TimerBox(formatUnit(hours), 'Hours')}
                {TimerBox(formatUnit(minutes), 'Minutes')}
                {TimerBox(formatUnit(seconds), 'Seconds')}
              </>
            );
          })()}
        </div>

        <Button
          variant="contained"
          size="large"
          onClick={handleClose}
          sx={{ backgroundColor: '#ff4081', fontWeight: 'bold' }}
        >
          {announcement.buttonText}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
