import {
  Html,
  Head,
  Preview,
  Heading,
  Section,
  Text,
  Button,
} from "@react-email/components";

interface VerificationEmailProps {
  username: string;
  otp: string;
}

export default function VerificationEmail({
  username,
  otp,
}: VerificationEmailProps) {
  return (
    <Html>
      <Head>
        <title>Verification Code</title>
      </Head>
      <Preview>Here's your verification code: {otp}</Preview>
      <Section style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
        <Heading as="h2" style={{ marginBottom: "10px" }}>
          Hello {username},
        </Heading>
        <Text style={{ marginBottom: "10px" }}>
          Thank you for registering. Please use the following verification code
          to complete your registration:
        </Text>
        <Text
          style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "10px" }}
        >
          {otp}
        </Text>
        <Text>If you did not request this code, please ignore this email.</Text>
        {/* Uncomment this section if you want to include a button */}
        {/* <Button
          href={`http://localhost:3000/verify/${username}`}
          style={{ marginTop: "20px", backgroundColor: "#007bff", color: "#ffffff", padding: "10px 20px", textDecoration: "none", borderRadius: "4px" }}
        >
          Verify here
        </Button> */}
      </Section>
    </Html>
  );
}
