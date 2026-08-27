import type { ReactNode } from "react";
import { ErrorBoundary, getErrorMessage } from "react-error-boundary";
import { Button } from "@/components/ui/button";
import { logger } from "@/utils/frontend_logger";

export default function GlobalErrorCatcher({
	children,
}: {
	children: ReactNode;
}) {
	return (
		<ErrorBoundary
			fallbackRender={({ error, resetErrorBoundary }) => (
				<article role="alert" className="bg-amber-400">
					<p>Something went wrong:</p>
					<pre>{getErrorMessage(error)}</pre>
					<Button type={"button"} onClick={resetErrorBoundary}>
						Try again
					</Button>
				</article>
			)}
			onError={(_, info) => {
				logger.error(info.componentStack);
			}}
			onReset={() => {
				// Reset any state that may have caused the error
			}}
		>
			{children}
		</ErrorBoundary>
	);
}
