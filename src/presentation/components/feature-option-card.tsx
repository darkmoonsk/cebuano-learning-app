"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

function FeatureOptionCard({
  title,
  description,
  content,
  href,
}: {
  title: string;
  description: string;
  content?: React.ReactNode;
  href: string;
}) {
  return (
    <Link href={href} className="block">
      <Card className="hover:shadow-lg transition-transform ease-in-out duration-300 hover:scale-105 transform-gpu cursor-pointer max-w-[280px]">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          {content}
        </CardContent>
      </Card>
    </Link>
  );
}

export default FeatureOptionCard;
