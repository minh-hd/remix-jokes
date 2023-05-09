import type { LoaderArgs} from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData, useParams } from "@remix-run/react";
import { db } from "~/utils/db.server";

export const loader = async ({ params }: LoaderArgs) => {
  const {
    jokeId: id
  } = params;

  return json({
    jokeListItems: await db.joke.findUnique({
      where: {
        id
      }
    }),
  });
};

export default function JokeRoute() {
  const data = useLoaderData<typeof loader | unknown>();
  const {
    jokeListItems: {
      name,
      content
    }
  } = data;

  return (
    <div>
      <p>Here's a random joke:</p>
      <p>{content}</p>
      <Link to=".">{name} Permalink</Link>
    </div>
  );
}

export function ErrorBoundary() {
  const { jokeId } = useParams();
  return (
    <div className="error-container">
      {`There was an error loading joke by the id: ${jokeId}. Sorry`}
    </div>
  )
}