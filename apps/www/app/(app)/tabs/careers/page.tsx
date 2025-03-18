"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CareersForm } from "../careers/components/careers-form";

interface Role {
  title: string;
  location?: string;
  description: string;
  fullDescription?: string;
  responsibilities: string[];
  requirements: {
    mustHave: string[];
    niceToHave?: string[];
  };
  compensation: {
    remote: string;
    tokenRewards: string;
    benefits?: string[];
  };
  applyLink: string;
}

export default function CareersPage() {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [expandedRoles, setExpandedRoles] = useState<Set<string>>(new Set());

  useEffect(() => {
    // eslint-disable-next-line turbo/no-undeclared-env-vars
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs`)
      .then((res) => res.json())
      .then((data: Role[]) => {
        console.log("✅ Fetched Roles:", data);
        setRoles(data);
      })
      .catch((err) => console.error("❌ Error fetching jobs:", err));
  }, []);

  const handleRoleClick = (role: Role) => {
    setExpandedRoles((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(role.title)) {
        newSet.delete(role.title);
      } else {
        newSet.add(role.title);
      }
      return newSet;
    });

    setSelectedRole(role);
  };

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
          <div className="space-y-2">
            {roles.map((role) => (
              <button
                key={role.title}
                onClick={() => handleRoleClick(role)}
                className={`w-full rounded-lg border p-4 text-left ${
                  expandedRoles.has(role.title)
                    ? "bg-blue-500 text-white"
                    : "bg-background text-muted-foreground"
                }`}
              >
                {role.title}
              </button>
            ))}
          </div>

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
              <h2 className="text-xl font-semibold">{selectedRole.title}</h2>
              <p className="mb-6 mt-2 text-sm text-muted-foreground">
                {selectedRole.description}
              </p>
              <h3 className="font-semibold">Responsibilities</h3>
              <ul className="mb-4 list-inside list-disc text-sm text-muted-foreground">
                {selectedRole?.responsibilities?.map((resp, index) => (
                  <li key={index}>{resp}</li>
                ))}
              </ul>
              <h3 className="font-semibold">Requirements</h3>
              <h4 className="font-semibold">Must Have:</h4>
              <ul className="mb-4 list-inside list-disc text-sm text-muted-foreground">
                {selectedRole?.requirements?.mustHave?.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
              <h4 className="font-semibold">Nice to Have:</h4>
              <ul className="mb-4 list-inside list-disc text-sm text-muted-foreground">
                {selectedRole?.requirements?.niceToHave?.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
              <h3 className="font-semibold">Compensation and Benefits</h3>
              <p className="text-sm text-muted-foreground">
                Remote: {selectedRole?.compensation?.remote} <br />
                Token Rewards: {selectedRole?.compensation?.tokenRewards} <br />
              </p>
              <ul className="mb-4 list-inside list-disc text-sm text-muted-foreground">
                {selectedRole?.compensation?.benefits?.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
              <Link
                href={selectedRole.applyLink}
                className="mt-4 inline-block text-primary underline"
              >
                Apply Now
              </Link>
              <CareersForm prefillRole={selectedRole.title} />
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
