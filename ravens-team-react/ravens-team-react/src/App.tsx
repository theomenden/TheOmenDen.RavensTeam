import './styles/App.scss';
import { MainLayout } from './components/layouts/main-layout';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import React, { ErrorInfo } from 'react';
import { useTwitchAuth } from './hooks/ext-auth-hooks/use-ext-auth';
import {
    Body1,
    Caption1,
    Button,
    Title2,
    Body2,
    Caption2,
} from "@fluentui/react-components";
import { ArrowSyncCircle16Regular } from "@fluentui/react-icons";
import {
    Card,
    CardFooter,
    CardHeader,
} from "@fluentui/react-components";

const logError = (error: Error, info: ErrorInfo) => {
    console.error(error, info);
  };

const fallbackComponent = ({ error, resetErrorBoundary }: FallbackProps) => {
    return (
        <Card>
            <CardHeader
                header={
                    <Title2 as="strong">
                        An Error Occurred
                    </Title2>

                }>
            </CardHeader>
            <Body2 as="p">
                We're sorry, but an error occurred while loading the app.
            </Body2>
            <Body1 as="p">
                If you're using the Twitch extension, please make sure you've enabled the "Allow access to your Twitch account" option in the extension settings.
                If you're not using the extension, please make sure you have the correct Twitch API access token.
            </Body1>
            <Caption1 as="p">
                Details: {error.message}
            </Caption1>
            <Caption2 as="p">
                Stacktrace: {<code>{error.stack}</code>}
            </Caption2>
            <Caption1 as="p">Please copy the above details and provide them to the developers for further assistance.</Caption1>
            <CardFooter>
                <Button
                    appearance="primary"
                    iconPosition='before'
                    icon={<ArrowSyncCircle16Regular />}
                    onClick={resetErrorBoundary}
                />
            </CardFooter>
        </Card>
    );
};

export const App: React.FC = () => {
    // Get broadcasterId and authToken from Twitch extension helper
    const { broadcasterId, authToken, loading: authLoading, error: authError } = useTwitchAuth();

    // If auth data is still loading, show loading state
    if (authLoading) return <div>Loading Twitch authentication...</div>;
    if (authError || !broadcasterId || !authToken) return <div>Error: {authError || "Unable to get Twitch auth data."}</div>;

    return (
        <ErrorBoundary FallbackComponent={fallbackComponent} onError={logError}>
            <MainLayout broadcasterId={broadcasterId} />
        </ErrorBoundary>
    );
};