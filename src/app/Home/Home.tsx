import { redirect } from 'next/navigation';

function Home() {
  redirect("/timer");
  // return (
  //   <div>home</div>
  // )
}

export default Home