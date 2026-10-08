import { motion } from "framer-motion";
import { Rss, Package, Leaf, AlertCircle } from "lucide-react";
import { GlassCard } from "@/components/common/GlassCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { clsx } from "clsx";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { useNavbarConfig } from "@/context/NavbarContext";

type BadgeVariant = "default" | "success" | "warning" | "danger" | "info" | "ai";

interface FeedItem {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string; ariaHidden?: boolean }>;
  color: string;
  badge: string;
  badgeVariant: BadgeVariant;
  time: string;
}

export function Feed() {
  const navigate = useNavigate();
  const { setConfig } = useNavbarConfig();
  const feedItems: FeedItem[] = [
    {
      id: 1,
      title: "Plastic bottle recycling updated",
      description: "New guidelines for PET #1 bottles in your area",
      icon: Package,
      color: "text-blue-primary",
      badge: "Updated",
      badgeVariant: "info",
      time: "2h ago",
    },
    {
      id: 2,
      title: "Community cleanup this Saturday",
      description: "Join volunteers at Riverside Park, 9 AM",
      icon: Leaf,
      color: "text-green-primary",
      badge: "Event",
      badgeVariant: "success",
      time: "5h ago",
    },
    {
      id: 3,
      title: "E-waste drop-off locations added",
      description: "3 new certified locations in downtown",
      icon: AlertCircle,
      color: "text-amber-primary",
      badge: "New",
      badgeVariant: "warning",
      time: "1d ago",
    },
  ];

  useEffect(() => {
    setConfig({
      onScanClick: () => navigate("/scanner"),
      onHomeClick: () => navigate("/"),
    });
  }, [navigate, setConfig]);

  return (
    <div className="min-h-screen bg-bg text-fg pt-14 sm:pt-16">
      <div className="section-container py-12 sm:py-20 lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
          className="max-w-3xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 1, 0.5, 1] }}
          >
            <h1 className="font-display text-4xl font-normal leading-[1.05] tracking-tight text-fg sm:text-5xl lg:text-6xl">
              Feed
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18, ease: [0.25, 1, 0.5, 1] }}
            className="mt-6 text-lg leading-relaxed text-fg-muted"
          >
            Stay updated with recycling news, community events, and waste management tips.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.26, ease: [0.25, 1, 0.5, 1] }}
            className="mt-10 space-y-4"
          >
            {feedItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <GlassCard variant="elevated" className="p-5">
                  <div className="flex items-start gap-4">
                    <div
                      className={clsx(
                        "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-brand/10",
                        item.color
                      )}
                    >
                      <item.icon className="w-6 h-6" aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-fg truncate">{item.title}</h3>
                        <Badge variant={item.badgeVariant} size="sm" dot>
                          {item.badge}
                        </Badge>
                      </div>
                      <p className="mt-1 text-fg-muted text-sm">{item.description}</p>
                      <p className="mt-2 text-fg-dim text-xs">{item.time}</p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <GlassCard variant="subtle" className="p-6 text-center">
                <Rss className="w-12 h-12 mx-auto text-fg-muted mb-4" aria-hidden="true" />
                <h3 className="font-semibold mb-2">More updates coming soon</h3>
                <p className="text-fg-muted text-sm mb-4">
                  We're building out your personalized waste intelligence feed.
                </p>
                <Button variant="secondary" leftIcon={<Rss className="w-4 h-4" />}>
                  Notify Me
                </Button>
              </GlassCard>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}