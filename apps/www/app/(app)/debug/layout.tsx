import { Metadata } from "next";

export const metadata: Metadata = {
title: "Debug Page",
description: "View wallet and network details for debugging.",
};

export default function DebugLayout({
children,
}: {
children: React.ReactNode;
}) {
return (
<div className="container-wrapper">
<header className="border-grid border-b py-4">
<h1 className="text-xl font-bold">Debug Information</h1>
</header>
<main className="container py-6">{children}</main>
<footer className="border-t py-4 text-center">
<a href="/" className="text-sm text-muted-foreground hover:underline">
Return to Home
</a>
</footer>
</div>
);
}
