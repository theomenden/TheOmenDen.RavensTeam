import { MessageBar, MessageBarBody, MessageBarTitle, Link, MessageBarActions, Button } from '@fluentui/react-components';
import { ArrowResetRegular, DismissRegular } from '@fluentui/react-icons';
import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';

const ErrorFallback = ({error, resetErrorBoundary}) => {
  return (<MessageBar>
    <MessageBarBody>
      <MessageBarTitle>Something went wrong.</MessageBarTitle>
      Message providing information to the user with actionable insights.{" "}
      <Link>Link</Link>
    </MessageBarBody>
    <MessageBarActions
      containerAction={
        <Button
          aria-label="dismiss"
          appearance="transparent"
          icon={<DismissRegular />}
        />
      }
    >
      <Button icon={<ArrowResetRegular />} onClick={resetErrorBoundary}>Reset</Button>
    </MessageBarActions>
  </MessageBar>);
}

interface ErrorProps {
  error: Error;
  resetErrorBoundary: () => void;
  children?: React.ReactNode;
}

export const ErrorBoundaryComponent: React.FC<ErrorProps> = ({ error, resetErrorBoundary, children }: ErrorProps) => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => {}}>
      {children}
    </ErrorBoundary>
  );
};