import type {
  V2_MetaFunction
} from "@remix-run/react";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts
} from "@remix-run/react";

import globalStylesUrl from './styles/global.css';
import globalMediumStylesUrl from './styles/global-medium.css';
import globalLargeStylesUrl from './styles/global-large.css';
import type { LinksFunction } from "@remix-run/node";
import type { ReactNode } from "react";

export const links: LinksFunction = () => {
  return [
    {
      rel: 'stylesheet',
      href: globalStylesUrl,
    },
    {
      rel: 'stylesheet',
      href: globalMediumStylesUrl,
      media: 'print, (min-width: 640px)',
    },
    {
      rel: 'stylesheet',
      href: globalLargeStylesUrl,
      media: 'screen and (min-width: 1024px)',
    },
  ];
};

export const meta: V2_MetaFunction = () => {
  const description = 'Learn Remix and laugh at the same time!';

  return [
    {
      charset: 'utf-8',
      description,
      keywords: 'Remix,jokes',
      'twitter:image': 'https://remix-jokes.lol/social.png',
      'twitter:card': 'summary_large_image',
      'twitter:creator': '@remix_run',
      'twitter:site': '@remix_run',
      'twitter:title': 'Remix Jokes',
      'twitter:description': description,
    },
  ];

}

function Document({ children, title = `Remix: So great, it's funny!` }: {
  children: ReactNode,
  title?: string
}) {
  return (
    <html lang="en">
      <head>
        <Meta />
        <title>{title}</title>
        <Links />
      </head>
      <body>
        {children}
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  return (
    <Document title="Uh-oh!" >
      <div className="error-container">
        <h1>App Error</h1>
        <pre>{error.message}</pre>
      </div>
    </Document>
  )
}