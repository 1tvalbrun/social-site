#!/bin/sh

# Get the current branch name
current_branch=$(git symbolic-ref --short HEAD 2>/dev/null)

# Define protected branches (you can add more)
protected_branches="main master"

# Check if current branch is protected
for branch in $protected_branches; do
  if [ "$current_branch" = "$branch" ]; then
    echo "🚫 ERROR: Direct commits to '$branch' branch are not allowed!"
    echo "💡 Please create a feature branch and submit a pull request."
    echo ""
    echo "To create a new branch:"
    echo "  git checkout -b feature/your-feature-name"
    echo ""
    exit 1
  fi
done

echo "✅ Branch check passed: committing to '$current_branch'"
exit 0 