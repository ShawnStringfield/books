import type { Meta, StoryObj } from "@storybook/react";
import { StatCard } from "./StatCard";
import { BookOpen } from "lucide-react";

const meta: Meta<typeof StatCard> = {
  title: "Features/Dashboard/Stats/StatCard",
  component: StatCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    icon: {
      control: false,
      description: "Icon component to display",
    },
    title: {
      control: "text",
      description: "Title of the stat",
    },
    value: {
      control: "text",
      description: "Value to display",
    },
    current: {
      control: { type: "number", min: 0 },
      description: "Current progress value",
    },
    goal: {
      control: { type: "number", min: 0 },
      description: "Goal value",
    },
    period: {
      control: "text",
      description: "Time period for the stat",
    },
  },
};

export default meta;
type Story = StoryObj<typeof StatCard>;

// Base story with default values
export const Default: Story = {
  args: {
    icon: <BookOpen className="w-5 h-5" />,
    title: "Books Read",
    value: "12 books",
    current: 12,
    goal: 24,
    period: "this year",
  },
};

// Story showing completed goal
export const GoalAchieved: Story = {
  args: {
    icon: <BookOpen className="w-5 h-5" />,
    title: "Books Read",
    value: "25 books",
    current: 25,
    goal: 24,
    period: "this year",
  },
};

// Story with no goal set
export const NoGoal: Story = {
  args: {
    icon: <BookOpen className="w-5 h-5" />,
    title: "Books Read",
    value: "8 books",
    current: 8,
    goal: 0,
    period: "this year",
  },
};

// Story with zero progress
export const ZeroProgress: Story = {
  args: {
    icon: <BookOpen className="w-5 h-5" />,
    title: "Books Read",
    value: "0 books",
    current: 0,
    goal: 24,
    period: "this year",
  },
};
