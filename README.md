# Alvin Estrada · Digital Observatory

Alvin's personal portfolio, built with Vue 3, TypeScript, Vite, and Three.js. An interactive orbital instrument connects cloud systems, artificial intelligence, and the curiosity behind the work.

The site is fully static and ready for GitHub Pages at [adawolfs.github.io](https://adawolfs.github.io/).

## Run locally

Use **Node.js 22.12 or newer**. CI uses Node.js 22.

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. `npm run serve` is also available as an alias for the development server.

```sh
npm run typecheck
npm run build
npm run preview
```

The production build is written to `dist/`. Preview serves that build locally so you can check the same files that Pages will publish.

## Verify interactions

Install Chromium once, then run the browser checks:

```sh
npx playwright install chromium
npm run test:e2e
```

On a fresh Linux CI machine, use `npx playwright install --with-deps chromium` to install the browser's system dependencies as well.

Also check the site on a narrow screen, navigate its controls with a keyboard, and try the operating system's reduced-motion preference. The 3D experience supports pointer orbiting, scene modes, pausing, and resetting; touch scrolling remains available. A visual fallback keeps the portfolio usable when WebGL is unavailable. The portfolio content does not depend on the 3D canvas.

## Publish with GitHub Pages

The workflow in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) installs the locked dependencies, builds the production site, verifies desktop and mobile interactions, and uploads `dist/` using GitHub's official Pages actions. Only the repository's **default branch** can deploy; the current default is `development`. Pull requests and other branches can build without publishing. The workflow detects the Pages source and deploys artifacts when it is set to GitHub Actions. Existing branch publishing stays available until that setting is changed.

1. In this repository on GitHub, open **Settings → Pages**.
2. Under **Build and deployment → Source**, select **GitHub Actions**.
3. Commit and push the finished site to the default branch, or run **Deploy portfolio to GitHub Pages** from the Actions tab on that branch.
4. Open the deployment URL from the successful workflow run.

No personal access token, deployment key, or `gh-pages` branch is needed. The deployment job uses the `github-pages` environment with `pages: write` and `id-token: write`; the build job has read access to the repository. If environment protection rules are enabled, allow the default branch to deploy.

This follows GitHub's [custom Pages workflow documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages) and [publishing-source setup](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site). Adding the workflow prepares deployment; it does not change the repository's Pages settings.

### Repository paths and custom domains

The default Vite base is `/`, appropriate for this `adawolfs.github.io` user site and for a domain hosted at its root.

For a project site such as `https://username.github.io/portfolio/`, add a repository **Actions variable** named `VITE_BASE_PATH` with the value `/portfolio/` under **Settings → Secrets and variables → Actions → Variables**. The workflow passes it to Vite. Include both leading and trailing slashes.

You can verify a project-path build locally:

```sh
VITE_BASE_PATH=/portfolio/ npm run build
npm run preview
```

Open the preview URL under `/portfolio/`. Set a custom domain in **Settings → Pages** and configure its DNS separately; a `CNAME` file alone does not configure a Pages domain.

## Maintain the portfolio

| File | Purpose |
| --- | --- |
| `src/lib/profile.ts` | Project descriptions, repository links, and profile links |
| `src/lib/observatory.ts` | Three.js scenes, orbit controls, animation, and WebGL lifecycle |
| `src/App.vue` | Portfolio layout and interactive UI |
| `src/style.css` | Visual system, responsive layout, and motion preferences |
| `static/images/` | Images copied into the production build |
| `src/assets/fonts/` | Locally served font files; licenses in `static/fonts/` |
| `vite.config.ts` | Public base path, static directory, and build configuration |

Vite copies assets from `static/`. The old `public/` directory is retained as source material for the previous site and is not included in the new build.

Profile copy draws on Alvin's [GitHub profile repository](https://github.com/adawolfs/adawolfs), public repositories, and the existing `public/profile.html` biography. The [CNCF ambassador directory](https://www.cncf.io/people/ambassadors/), [KCD Guatemala event](https://community2.cncf.io/events/details/cncf-kcd-guatemala-presents-kcd-antigua-guatemala-2025/), and [KCD Argentina report](https://www.cncf.io/blog/2024/05/24/kcd-argentina-2024-mastering-the-kubernetes-tango-and-scoring-goals-in-container-orchestration/) support the community content. LinkedIn is linked for the complete professional profile; restricted LinkedIn content was not treated as a verified source. Edit the introduction and biography in `src/App.vue` and project details in `src/lib/profile.ts`.
