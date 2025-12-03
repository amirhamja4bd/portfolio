import * as LucideIcons from "lucide-react";

const DynamicIcon = ({
  name,
  className,
}: {
  name: string;
  className?: string;
}) => {
  const IconComponent = (LucideIcons as any)[name];
  if (!IconComponent) return <LucideIcons.Slack className={className} />;
  return <IconComponent className={className} />;
};

export default DynamicIcon;
