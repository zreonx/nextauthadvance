interface ActivationPageProps {
  params: {
    id: string;
  };
}
export default function ActivationPage({ params }: ActivationPageProps) {
  return <div>{params.id}</div>;
}
