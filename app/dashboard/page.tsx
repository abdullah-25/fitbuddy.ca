"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronDown, ChevronUp, Dumbbell, LineChart, LogOut, Plus, User, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTheme } from "next-themes"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
// import { useToast } from "@/hooks/use-toast"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock data for the progress chart
const progressData = {
    "Bench Press": [
        { date: "Apr 1", weight: 135 },
        { date: "Apr 5", weight: 145 },
        { date: "Apr 10", weight: 145 },
        { date: "Apr 15", weight: 155 },
        { date: "Apr 20", weight: 160 },
        { date: "Apr 24", weight: 165 },
    ],
    Squat: [
        { date: "Apr 2", weight: 185 },
        { date: "Apr 7", weight: 195 },
        { date: "Apr 12", weight: 205 },
        { date: "Apr 17", weight: 215 },
        { date: "Apr 22", weight: 225 },
    ],
    Deadlift: [
        { date: "Apr 3", weight: 225 },
        { date: "Apr 8", weight: 235 },
        { date: "Apr 13", weight: 245 },
        { date: "Apr 18", weight: 255 },
        { date: "Apr 23", weight: 265 },
    ],
    "Shoulder Press": [
        { date: "Apr 4", weight: 95 },
        { date: "Apr 9", weight: 100 },
        { date: "Apr 14", weight: 105 },
        { date: "Apr 19", weight: 110 },
        { date: "Apr 24", weight: 115 },
    ],
}

export default function WorkoutTracker() {
    const router = useRouter()
    const { theme, setTheme } = useTheme()
    // const { toast } = useToast()
    const [exerciseName, setExerciseName] = useState("Bench Press")
    const [sets, setSets] = useState([
        { id: 1, weight: 135, reps: 8, completed: false },
        { id: 2, weight: 135, reps: 8, completed: false },
    ])
    const [user, setUser] = useState<{ name?: string; email: string } | null>(null)
    const [isGuest, setIsGuest] = useState(false)

    useEffect(() => {
        // Check if user is logged in or using guest mode
        const userJson = localStorage.getItem("fitbuddy-user")
        const guestMode = localStorage.getItem("fitbuddy-guest")

        if (userJson) {
            setUser(JSON.parse(userJson))
            setIsGuest(false)
        } else if (guestMode === "true") {
            setIsGuest(true)
        } else {
            // Not authenticated, redirect to login
            router.push("/")
        }
    }, [router])

    const handleSignOut = () => {
        localStorage.removeItem("fitbuddy-user")
        localStorage.removeItem("fitbuddy-guest")

        // toast({
        //     title: "Signed out",
        //     description: "You have been signed out successfully",
        // })

        router.push("/")
    }

    const addSet = () => {
        const lastSet = sets[sets.length - 1]
        const newSet = {
            id: sets.length + 1,
            weight: lastSet ? lastSet.weight : 0,
            reps: lastSet ? lastSet.reps : 0,
            completed: false,
        }
        setSets([...sets, newSet])
    }

    const deleteSet = (id: number) => {
        setSets(sets.filter((set) => set.id !== id))
    }

    const updateSet = (id: number, field: "weight" | "reps", value: number) => {
        setSets(sets.map((set) => (set.id === id ? { ...set, [field]: value } : set)))
    }

    const toggleComplete = (id: number) => {
        setSets(sets.map((set) => (set.id === id ? { ...set, completed: !set.completed } : set)))
    }

    const incrementValue = (id: number, field: "weight" | "reps", increment: number) => {
        setSets(sets.map((set) => (set.id === id ? { ...set, [field]: Math.max(0, set[field] + increment) } : set)))
    }

    // Calculate stats
    const weights = sets.map((set) => set.weight)
    const avgWeight = weights.length ? weights.reduce((a, b) => a + b, 0) / weights.length : 0
    const minWeight = weights.length ? Math.min(...weights) : 0
    const maxWeight = weights.length ? Math.max(...weights) : 0

    // Get progress data for the selected exercise
    const currentExerciseData = progressData[exerciseName as keyof typeof progressData] || []

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Dumbbell className="h-5 w-5 text-emerald-500" />
                    <h1 className="font-bold text-lg">FitBuddy</h1>
                </div>
                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full">
                                <User className="h-5 w-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <div className="px-2 py-1.5">
                                <p className="text-sm font-medium">{isGuest ? "Guest User" : user?.name || user?.email}</p>
                                {isGuest && <p className="text-xs text-muted-foreground">Using demo mode</p>}
                            </div>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleSignOut}>
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>{isGuest ? "Exit Demo" : "Sign Out"}</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 container max-w-md mx-auto px-4 py-6">
                <Tabs defaultValue="workout" className="w-full">
                    <TabsList className="grid grid-cols-3 mb-6">
                        <TabsTrigger value="workout">Current Workout</TabsTrigger>
                        <TabsTrigger value="progress">Progress</TabsTrigger>
                        <TabsTrigger value="history">History</TabsTrigger>
                    </TabsList>

                    <TabsContent value="workout" className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold">Workout</h2>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                    Discard
                                </Button>
                                <Button variant="default" size="sm">
                                    Save
                                </Button>
                            </div>
                        </div>

                        {/* Exercise Selection */}
                        <Card>
                            <CardContent className="p-4">
                                <Select defaultValue={exerciseName} onValueChange={setExerciseName}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select an exercise" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Bench Press">Bench Press</SelectItem>
                                        <SelectItem value="Squat">Squat</SelectItem>
                                        <SelectItem value="Deadlift">Deadlift</SelectItem>
                                        <SelectItem value="Shoulder Press">Shoulder Press</SelectItem>
                                    </SelectContent>
                                </Select>
                            </CardContent>
                        </Card>

                        {/* Exercise Stats */}
                        <Card>
                            <CardContent className="p-4 text-sm">
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                                        <p className="text-emerald-600 dark:text-emerald-400 font-medium">Average</p>
                                        <p className="font-bold">{avgWeight} lbs</p>
                                    </div>
                                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                        <p className="text-blue-600 dark:text-blue-400 font-medium">Minimum</p>
                                        <p className="font-bold">{minWeight} lbs</p>
                                    </div>
                                    <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                        <p className="text-purple-600 dark:text-purple-400 font-medium">Maximum</p>
                                        <p className="font-bold">{maxWeight} lbs</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Sets */}
                        <div className="space-y-3">
                            {sets.map((set, index) => (
                                <Card
                                    key={set.id}
                                    className={`transition-all ${set.completed ? "border-emerald-500 dark:border-emerald-500" : ""}`}
                                >
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <h3 className="font-medium">Set {index + 1}</h3>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 rounded-full hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-900/20"
                                                onClick={() => deleteSet(set.id)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4">
                                            {/* Weight */}
                                            <div>
                                                <label className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 block">
                                                    Weight (lbs)
                                                </label>
                                                <div className="flex items-center">
                                                    <Input
                                                        type="number"
                                                        value={set.weight}
                                                        onChange={(e) => updateSet(set.id, "weight", Number.parseInt(e.target.value) || 0)}
                                                        className="text-center"
                                                    />
                                                    <div className="flex flex-col ml-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-6 w-6"
                                                            onClick={() => incrementValue(set.id, "weight", 5)}
                                                        >
                                                            <ChevronUp className="h-3 w-3" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-6 w-6"
                                                            onClick={() => incrementValue(set.id, "weight", -5)}
                                                        >
                                                            <ChevronDown className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Reps */}
                                            <div>
                                                <label className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 block">Reps</label>
                                                <div className="flex items-center">
                                                    <Input
                                                        type="number"
                                                        value={set.reps}
                                                        onChange={(e) => updateSet(set.id, "reps", Number.parseInt(e.target.value) || 0)}
                                                        className="text-center"
                                                    />
                                                    <div className="flex flex-col ml-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-6 w-6"
                                                            onClick={() => incrementValue(set.id, "reps", 1)}
                                                        >
                                                            <ChevronUp className="h-3 w-3" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-6 w-6"
                                                            onClick={() => incrementValue(set.id, "reps", -1)}
                                                        >
                                                            <ChevronDown className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Complete Button */}
                                            <div className="flex items-end justify-center">
                                                <Button
                                                    variant={set.completed ? "default" : "outline"}
                                                    className={`w-full ${set.completed ? "bg-emerald-500 hover:bg-emerald-600" : ""}`}
                                                    onClick={() => toggleComplete(set.id)}
                                                >
                                                    {set.completed ? "Done" : "Complete"}
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Add Set Button */}
                        <div className="flex justify-center">
                            <Button variant="outline" onClick={addSet} className="flex items-center gap-2">
                                <Plus className="h-4 w-4" />
                                Add Set
                            </Button>
                        </div>
                    </TabsContent>

                    {/* Progress Tab */}
                    <TabsContent value="progress" className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold">Progress</h2>
                            <Select defaultValue={exerciseName} onValueChange={setExerciseName}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select an exercise" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Bench Press">Bench Press</SelectItem>
                                    <SelectItem value="Squat">Squat</SelectItem>
                                    <SelectItem value="Deadlift">Deadlift</SelectItem>
                                    <SelectItem value="Shoulder Press">Shoulder Press</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <LineChart className="h-5 w-5 text-emerald-500" />
                                    {exerciseName} Progress
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart
                                            data={currentExerciseData}
                                            margin={{
                                                top: 10,
                                                right: 10,
                                                left: 0,
                                                bottom: 0,
                                            }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                                            <XAxis dataKey="date" tick={{ fontSize: 12 }} tickMargin={10} />
                                            <YAxis
                                                tick={{ fontSize: 12 }}
                                                tickMargin={10}
                                                label={{
                                                    value: "Weight (lbs)",
                                                    angle: -90,
                                                    position: "insideLeft",
                                                    style: { fontSize: "12px", textAnchor: "middle" },
                                                }}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: theme === "dark" ? "#1f2937" : "#fff",
                                                    borderColor: theme === "dark" ? "#374151" : "#e5e7eb",
                                                    borderRadius: "6px",
                                                    fontSize: "12px",
                                                }}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="weight"
                                                stroke="#10b981"
                                                fill="#10b981"
                                                fillOpacity={0.2}
                                                strokeWidth={2}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Performance Insights</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4 text-sm">
                                    {currentExerciseData.length > 1 && (
                                        <>
                                            <div className="flex justify-between">
                                                <span>Starting Weight:</span>
                                                <span className="font-medium">{currentExerciseData[0].weight} lbs</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Current Weight:</span>
                                                <span className="font-medium">
                                                    {currentExerciseData[currentExerciseData.length - 1].weight} lbs
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Total Improvement:</span>
                                                <span className="font-medium text-emerald-500">
                                                    +{currentExerciseData[currentExerciseData.length - 1].weight - currentExerciseData[0].weight}{" "}
                                                    lbs
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Improvement Rate:</span>
                                                <span className="font-medium text-emerald-500">
                                                    {Math.round(
                                                        ((currentExerciseData[currentExerciseData.length - 1].weight -
                                                            currentExerciseData[0].weight) /
                                                            currentExerciseData[0].weight) *
                                                        100,
                                                    )}
                                                    %
                                                </span>
                                            </div>
                                        </>
                                    )}
                                    {currentExerciseData.length <= 1 && (
                                        <p className="text-gray-500 dark:text-gray-400">
                                            Not enough data to show insights. Complete more workouts to see your progress.
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="history">
                        <div className="flex flex-col items-center justify-center h-40 text-center text-gray-500">
                            <p>Your workout history will appear here</p>
                        </div>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    )
}
