import React, { Component, ErrorInfo, ReactNode } from 'react';
import styled from 'styled-components';

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 40px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
`;

const ErrorTitle = styled.h2`
  font-size: 32px;
  margin-bottom: 20px;
  font-weight: 700;
`;

const ErrorMessage = styled.p`
  font-size: 18px;
  margin-bottom: 30px;
  opacity: 0.9;
`;

const ErrorDetails = styled.details`
  margin-top: 20px;
  text-align: left;
  background: rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 12px;
  max-width: 600px;
  width: 100%;
`;

const ErrorSummary = styled.summary`
  cursor: pointer;
  font-weight: 600;
  margin-bottom: 10px;
`;

const ErrorPre = styled.pre`
  font-size: 12px;
  overflow: auto;
  background: rgba(0, 0, 0, 0.2);
  padding: 15px;
  border-radius: 8px;
`;

const RefreshButton = styled.button`
  margin-top: 20px;
  padding: 15px 30px;
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 1);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  }
`;

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <ErrorTitle>Something went wrong.</ErrorTitle>
          <ErrorMessage>Please refresh the page and try again.</ErrorMessage>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <ErrorDetails>
              <ErrorSummary>Error details (development only)</ErrorSummary>
              <ErrorPre>
                {this.state.error.toString()}
              </ErrorPre>
            </ErrorDetails>
          )}
          <RefreshButton onClick={() => window.location.reload()}>
            Refresh Page
          </RefreshButton>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
