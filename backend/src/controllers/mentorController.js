import { getMentorTodayStats } from "../services/mentorService.js";

export function getMentorStats(req, res) {
  res.json({
    success: true,
    data: getMentorTodayStats()
  });
}
