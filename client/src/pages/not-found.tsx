import styled from "styled-components";
import { AlertCircle } from "lucide-react";

const Container = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
`;

const ErrorCard = styled.div`
  width: 100%;
  max-width: 28rem;
  margin: 0 1rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  margin-bottom: 1rem;
  gap: 0.5rem;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
`;

const Message = styled.p`
  margin-top: 1rem;
  font-size: 0.875rem;
  color: #6b7280;
`;

export default function NotFound() {
  return (
    <Container>
      <ErrorCard>
        <Header>
          <AlertCircle size={32} color="#ef4444" />
          <Title>404 Page Not Found</Title>
        </Header>
        <Message>
          Did you forget to add the page to the router?
        </Message>
      </ErrorCard>
    </Container>
  );
}
