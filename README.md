# vuebp

Vue 3 + Vite front end for [Laravel-Passport-Boilerplate](https://github.com/miesaf/Laravel-Passport-Boilerplate),
with Bootstrap 5 and BootstrapVueNext. Needs Node 20.19+ (or 22.12+).

## Project setup
```
npm install
cp .env.local.example .env.local   # then set the back end URL, app URL and idle time out
```

### Compiles and hot-reloads for development
```
npm run serve        # http://localhost:8080
```

### Compiles and minifies for production
```
npm run build        # output in dist/
npm run preview      # serve dist/ locally
```

### Lints files
```
npm run lint
```

### Configuration
`.env.local` keeps the `VUE_APP_*` names (read as `import.meta.env.VUE_APP_*`):
`VUE_APP_NAME` (title), `VUE_APP_URL` (where to go after a forced logout), `VUE_APP_BE` (API base URL, with the
trailing slash), `VUE_APP_SITO` (seconds of inactivity before the logout warning) and `VUE_APP_PUBLIC` (base path of the
built files). See the [Vite configuration reference](https://vite.dev/config/).
