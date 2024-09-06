import SignInForm from "@/app/components/SignInForm";

export default function SignInPage() {
  return (
    <div className='p-4'>
      <div className='w-[75%] md:w-[50%] mx-auto mt-5'>
        <SignInForm callbackUrl='/' />
      </div>
    </div>
  );
}
