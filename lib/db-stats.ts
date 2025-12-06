
// Get issue statistics (counts by status)
export async function getIssueStats() {
    try {
        const supabase = await createServerClient_()

        // We can't easily get counts and data in one go efficiently without select(count)
        // So we run a lightweight count query
        const { data, error } = await supabase
            .from("issues")
            .select("status, category") // minimal selection

        if (error) throw error

        return {
            total: data?.length || 0,
            pending: data?.filter(i => i.status === 'pending').length || 0,
            inProgress: data?.filter(i => i.status === 'in-progress').length || 0,
            resolved: data?.filter(i => i.status === 'resolved').length || 0,
        }
    } catch (error) {
        logger.error("[DB] Error fetching issue stats:", error)
        return { total: 0, pending: 0, inProgress: 0, resolved: 0 }
    }
}
