import SignInForm from "@/app/components/SignInForm";

interface SignInPageProps {
  searchParams: {
    callbackUrl?: string;
  };
}

export default function SignInPage({ searchParams }: SignInPageProps) {
  console.log({ searchParams });
  return (
    <div className='p-4'>
      <div className='w-[75%] md:w-[50%] mx-auto mt-5'>
        <SignInForm callbackUrl={searchParams.callbackUrl} />
      </div>
    </div>
  );
}
