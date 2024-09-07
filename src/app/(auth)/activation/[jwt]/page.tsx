import { activateUser } from "@/lib/actions/authActions";

interface ActivationPageProps {
  params: {
    jwt: string;
  };
}
export default async function ActivationPage({ params }: ActivationPageProps) {
  const result = await activateUser(params.jwt);

  return (
    <div className='h-screen flex flex-col items-center justify-center'>
      {result === "userNotExits" ? (
        <p className='text-red-500 text-2xl'>The user does not exists</p>
      ) : result === "alreadyActivated" ? (
        <p className='text-red-500 text-2xl'>The user is already activated</p>
      ) : result === "success" ? (
        <p className='text-green-500 text-2xl'>The user has been activated</p>
      ) : (
        <p className='text-2xl'>Oops! Something went wrong.</p>
      )}
    </div>
  );
}
