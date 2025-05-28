import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top: 4px solid white;
  animation: ${spin} 1s linear infinite;
  margin-bottom: 20px;
`;

const LoaderText = styled.div`
  font-size: 18px;
  font-weight: 500;
  opacity: 0.9;
`;

export default function LazyLoader() {
  return (
    <LoaderContainer>
      <Spinner />
      <LoaderText>Loading...</LoaderText>
    </LoaderContainer>
  );
}