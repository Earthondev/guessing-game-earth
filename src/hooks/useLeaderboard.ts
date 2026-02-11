import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface LeaderboardEntry {
    id: string;
    player_name: string;
    score: number;
    category: string;
    total_questions: number;
    created_at: string;
}

export const useLeaderboard = () => {
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const fetchLeaderboard = useCallback(async (category?: string, limit = 10) => {
        setLoading(true);
        try {
            let query = supabase
                .from("leaderboard")
                .select("*")
                .order("score", { ascending: false })
                .limit(limit);

            if (category) {
                query = query.eq("category", category);
            }

            const { data, error } = await query;
            if (error) throw error;
            setEntries(data || []);
        } catch (error) {
            console.error("Error fetching leaderboard:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    const submitScore = useCallback(async (
        playerName: string,
        score: number,
        category: string,
        totalQuestions: number = 10
    ) => {
        try {
            const { error } = await supabase
                .from("leaderboard")
                .insert({
                    player_name: playerName.trim(),
                    score,
                    category,
                    total_questions: totalQuestions,
                });

            if (error) throw error;

            toast({
                title: "🏆 บันทึกคะแนนแล้ว!",
                description: `${playerName} ได้ ${score} คะแนน`,
            });

            return true;
        } catch (error) {
            console.error("Error submitting score:", error);
            toast({
                title: "เกิดข้อผิดพลาด",
                description: "ไม่สามารถบันทึกคะแนนได้",
                variant: "destructive",
            });
            return false;
        }
    }, [toast]);

    return {
        entries,
        loading,
        fetchLeaderboard,
        submitScore,
    };
};
