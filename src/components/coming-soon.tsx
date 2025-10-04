"use client";

import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Typography } from "./typography";
import { TrafficCone } from "@phosphor-icons/react";

const ComingSoon = () => {
  return (
    <div className="h-124 flex items-center justify-center bg-muted px-4">
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
              <TrafficCone size={72} className="text-brand" />

              <Typography variant="h1" as="span">
                Coming Soon
              </Typography>

              <p className="text-muted-foreground text-lg font-medium">
                Acest conținut va fi disponibil în curând!
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ComingSoon;
