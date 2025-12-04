import { createServerClient_ } from "./supabase-server"

export type NotificationType = "issue_update" | "comment_reply" | "issue_resolved" | "new_issue" | "issue_assigned"

/**
 * Send email notification to user
 * This is a placeholder - implement with your email service (Resend, SendGrid, etc.)
 */
export async function sendEmailNotification(
  userId: string,
  title: string,
  message: string,
  _type: NotificationType,
): Promise<void> {
  try {
    const supabase = await createServerClient_()
    
    // Get user email and preferences
    const { data: profile } = await supabase
      .from("profiles")
      .select("email, email_notifications_enabled")
      .eq("id", userId)
      .single()

    if (!profile?.email_notifications_enabled) {
      return // User has disabled email notifications
    }

    // In production, implement with your email service:
    // Example with Resend:
    // await fetch('https://api.resend.com/emails', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     from: 'WeReport <notifications@wereport.sl>',
    //     to: profile.email,
    //     subject: title,
    //     html: `<p>${message}</p>`,
    //   }),
    // })

    // For now, log in development
    if (process.env.NODE_ENV === "development") {
      console.log(`[Email] Would send to ${profile.email}: ${title} - ${message}`)
    }
  } catch (error) {
    console.error("[Notifications] Error sending email:", error)
    throw error
  }
}

export async function createNotification(
  userId: string,
  type: NotificationType,
  title: string,
  message: string,
  issueId?: string,
) {
  try {
    const supabase = await createServerClient_()
    const { data, error } = await supabase
      .from("notifications")
      .insert([
        {
          user_id: userId,
          type,
          title,
          message,
          issue_id: issueId,
        },
      ])
      .select()
      .single()

    if (error) throw error

    // Send email notification if user has email notifications enabled
    // This can be implemented with a service like Resend, SendGrid, or Supabase Edge Functions
    try {
      await sendEmailNotification(userId, title, message, type)
    } catch (emailError) {
      // Log but don't fail notification creation if email fails
      console.error("[Notifications] Failed to send email:", emailError)
    }

    return data
  } catch (error) {
    console.error("[Notifications] Error creating notification:", error)
    return null
  }
}

export async function notifyIssueUpdate(issueId: string, title: string, newStatus: string) {
  try {
    const supabase = await createServerClient_()

    // Get the issue reporter
    const { data: issue, error: issueError } = await supabase
      .from("issues")
      .select("user_id")
      .eq("id", issueId)
      .single()

    if (issueError) throw issueError

    // Create notification for the reporter
    await createNotification(
      issue.user_id,
      "issue_update",
      "Issue Update",
      `Your report "${title}" status changed to ${newStatus}`,
      issueId,
    )
  } catch (error) {
    console.error("[Notifications] Error sending issue update notification:", error)
  }
}

export async function notifyIssueResolved(issueId: string, title: string) {
  try {
    const supabase = await createServerClient_()

    const { data: issue, error } = await supabase.from("issues").select("user_id").eq("id", issueId).single()

    if (error) throw error

    await createNotification(
      issue.user_id,
      "issue_resolved",
      "Issue Resolved",
      `Your report "${title}" has been marked as resolved`,
      issueId,
    )
  } catch (error) {
    console.error("[Notifications] Error sending resolved notification:", error)
  }
}

export async function notifyCommentReply(
  issueId: string,
  issueTitle: string,
  commenterId: string,
  commenterName: string,
) {
  try {
    const supabase = await createServerClient_()

    // Get issue owner and all commenters except the new commenter
    const { data: issue } = await supabase.from("issues").select("user_id, title").eq("id", issueId).single()

    if (!issue) return

    const { data: comments } = await supabase
      .from("comments")
      .select("user_id")
      .eq("issue_id", issueId)
      .neq("user_id", commenterId)

    // Create set of unique user IDs to notify
    const usersToNotify = new Set<string>()

    // Add issue owner
    if (issue.user_id !== commenterId) {
      usersToNotify.add(issue.user_id)
    }

    // Add other commenters
    comments?.forEach((comment) => {
      if (comment.user_id !== commenterId) {
        usersToNotify.add(comment.user_id)
      }
    })

    // Send notifications to all relevant users
    await Promise.all(
      Array.from(usersToNotify).map((userId) =>
        createNotification(
          userId,
          "comment_reply",
          "New Comment",
          `${commenterName} commented on "${issueTitle}"`,
          issueId,
        ),
      ),
    )
  } catch (error) {
    console.error("[Notifications] Error sending comment notifications:", error)
  }
}

export async function notifyIssueAssignment(issueId: string, issueTitle: string, _authorityId: string) {
  try {
    const supabase = await createServerClient_()

    const { data: issue } = await supabase.from("issues").select("user_id").eq("id", issueId).single()

    if (!issue) return

    await createNotification(
      issue.user_id,
      "issue_assigned",
      "Issue Assigned",
      `Your report "${issueTitle}" has been assigned to an authority for resolution`,
      issueId,
    )
  } catch (error) {
    console.error("[Notifications] Error sending assignment notification:", error)
  }
}
