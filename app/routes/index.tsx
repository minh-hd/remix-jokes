import type { LinksFunction, V2_MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

import cssStylesheet from '~/styles/index.css';

export const links: LinksFunction = () => {
  return [{
    rel: "stylesheet",
    href: cssStylesheet
  }];
};

export const meta: V2_MetaFunction = () => {
  return [{ title: "New Remix App" }];
};

export default function Index() {
  return (
    <div className="container">
      <div className="content">
        <h1>
          Remix <span>Jokes!</span>
        </h1>
        <nav>
          <ul>
            <li>
              <Link to="jokes">Read Jokes</Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  return (
    <div className="error-container">
      I did a whoopsies.
    </div>
  )
}