"use client";

import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Typography } from "./typography";
import { ImageBroken } from "@phosphor-icons/react";
import { Button } from "./ui/button";
import { paths } from "@/routes/paths";
import Link from "next/link";

const NotFound = () => {
  return (
    <div className="h-screen flex items-center justify-center bg-muted px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}>
        <motion.div
          animate={{
            scale: [1, 1.02, 1],
            boxShadow: [
              "0 4px 6px rgba(0, 0, 0, 0.1)",
              "0 10px 15px rgba(0, 0, 0, 0.2)",
              "0 4px 6px rgba(0, 0, 0, 0.1)",
            ],
          }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: "easeInOut",
          }}
          className="rounded-2xl overflow-hidden">
          <Card className="max-w-md w-full rounded-2xl p-8 bg-background">
            <CardContent className="flex flex-col items-center text-center space-y-6">
              <ImageBroken size={72} className="text-brand" />

              <Typography variant="h1" as="span">
                Content restricted
              </Typography>

              <p className="text-muted-foreground text-lg font-medium">
                Nu ai access la acest conținut.
              </p>
              <Button asChild>
                <Link href={paths.dashboard.root}>
                  Du-te la ecranul principal
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;
