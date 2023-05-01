import { json, type LinksFunction } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import stylesUrl from '~/styles/jokes.css';
import { db } from '~/utils/db.server';

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: stylesUrl }];
};

export const loader =async () => {
  const count = await db.joke.count();
  const randomNumber = Math.floor(Math.random() * count);
  const [randomJoke] = await db.joke.findMany({
    skip: randomNumber,
    take: 1
  });

  return json({
    randomJoke
  });
}


export default function JokesIndexRoute() {
  const data = useLoaderData<typeof loader>();
  const {
    randomJoke: {
      content,
      id,
      name
    }
  } = data;

  return (
    <div>
      <p>Here's a random joke:</p>
      <p>{content}</p>
      <Link to={id}>{name}</Link>
    </div>
  )
}
