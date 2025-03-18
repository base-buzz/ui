"use client";

import { useState } from "react";
import Link from "next/link";
import { CareersForm } from "../careers/components/careers-form";
import RoleList, { roles } from "../careers/components/role-list";

export default function CareersPage() {
  const [selectedRole, setSelectedRole] = useState<(typeof roles)[0] | null>(
    roles?.length ? roles[0] : null,
  );
  return (
    <div className="container relative py-12">
      <h1 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
        Join the BaseBuzz Team 🚀
      </h1>
      <p className="mx-auto max-w-xl text-center text-muted-foreground">
        We&apos;re hiring AI engineers, blockchain devs, analysts, social
        managers, testers, and designers. Submit your details and a 2-min Loom
        video!
      </p>

      {/* Two-column layout */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left Column - Open Roles */}
        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-background p-6 shadow-md">
            <h2 className="text-xl font-semibold">Why Join BaseBuzz?</h2>
            <p className="text-sm text-muted-foreground">
              Work on cutting-edge AI-powered DeFi applications, meme
              speculation, and RWA tokenization. Be part of a fast-moving,
              decentralized, and innovative team.
            </p>
          </div>

          {/* Role List */}
          <RoleList
            selectedRole={selectedRole} // Ensure proper typing
            setSelectedRole={(role: (typeof roles)[0]) => {
              setSelectedRole(role);
            }}
          />

          <div className="rounded-lg border border-border bg-background p-6 shadow-md">
            <h2 className="text-xl font-semibold">Benefits</h2>
            <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
              <li>🌍 Fully Remote & Flexible Hours</li>
              <li>💰 Competitive Token Allocations</li>
              <li>🚀 Work on the Future of DeFi & RWA</li>
              <li>🎯 Join a High-Growth, Fast-Paced Team</li>
            </ul>
          </div>

          <div className="rounded-lg border border-border bg-background p-6 shadow-md">
            <h2 className="text-xl font-semibold">
              Smart Contract-Based Token Rewards
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Our innovative token rewards system ensures that your payments
              flow automatically to your wallet, providing you with timely and
              reliable compensation.
            </p>
          </div>
        </div>

        {/* Right Column - Selected Role & Application Form */}
        <div className="rounded-lg border border-border bg-background p-6 shadow-md">
          {selectedRole ? (
            <>
              <h2 className="text-xl font-semibold">
                {selectedRole?.title || "Select a Role"}
              </h2>
              <p className="mb-6 mt-2 text-sm text-muted-foreground">
                {selectedRole?.description ||
                  "Choose a role from the list to view details."}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {selectedRole?.fullDescription ||
                  "Choose a role from the list to view details."}
              </p>
              {/* Careers Form with Pre-filled Role */}
              <CareersForm prefillRole={selectedRole?.title || ""} />
            </>
          ) : (
            <p className="text-center text-sm text-muted-foreground">
              Select a role to see details and apply.
            </p>
          )}
        </div>
      </div>

      {/* Legal Disclaimer */}
      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          By applying, you agree to our{" "}
          <Link
            href="/terms"
            className="underline underline-offset-4 hover:text-primary"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="underline underline-offset-4 hover:text-primary"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
