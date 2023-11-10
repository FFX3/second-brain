## System dependencies (other than rust and node)

```bash
sudo pacman -Syu
sudo pacman -S --needed \
    webkit2gtk \
    base-devel \
    curl \
    wget \
    file \
    openssl \
    appmenu-gtk-module \
    gtk3 \
    libappindicator-gtk3 \
    librsvg \
    libvips
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## ENVs

```
DATABASE_URL=
ANON_KEY=
```

## Supabase

[cli docs](https://supabase.com/docs/guides/cli)
supabase init
supabase link --project-ref <ref>
npm run generate-supabase-types
