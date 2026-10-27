# Hosting

The app is a static site. `yarn build` writes it to `dist/`, and any web server that falls
back to `index.html` for unknown paths can serve it. That fallback matters because the app
routes on the client, so a path such as `/p/aika` has no file behind it.

There are two ways to ship a release.

## Docker image

The release workflow in `.github/workflows/release.yml` is started by hand from the GitHub
Actions tab. It does the following:

1. Bumps the version in `package.json` on a release branch.
2. Builds the Docker image from that commit and pushes it to
   `ghcr.io/thaapasa/calculators`, tagged with the version and `latest`.
3. Merges the branch into `master`, tags the commit and publishes a GitHub release.

The image is built for `linux/arm64` only, because the server is an ARM machine. It runs
nginx as a non-root user and listens on port 3000. `nginx.conf` holds the server
configuration.

## Direct upload

`yarn deploy` runs `script/deploy.sh`, which does the following:

1. Builds the app and packs `dist/` into `deploy/calculators-<rev>.tar.gz`, where `<rev>`
   is the start of the commit hash.
2. Copies the archive over SSH to `deployer@laskurit.pomeranssi.fi`.
3. Pulls the repo on the server and unpacks the archive into `dist/` there.
