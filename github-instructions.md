# GitHub Repository Setup Instructions

To push this repository to GitHub, you need to:

1. Create a new repository on GitHub:
   - Go to https://github.com/new
   - Enter a repository name (e.g., 'shiki-test')
   - Choose public or private visibility
   - Do NOT initialize with README, .gitignore, or license
   - Click 'Create repository'

2. After creating the repository, GitHub will show commands to push an existing repository.
   You'll need the repository URL which looks like:
   https://github.com/YOUR-USERNAME/shiki-test.git
   or
   git@github.com:YOUR-USERNAME/shiki-test.git (if using SSH)

3. Run the following commands in your terminal:
   ```
   git remote add origin YOUR_REPOSITORY_URL
   git push -u origin master
   ```

Replace YOUR_REPOSITORY_URL with the URL of your GitHub repository.
