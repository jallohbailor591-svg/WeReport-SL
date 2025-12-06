const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials. Check your .env.local file.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function backupIssues() {
  try {
    console.log('🔄 Starting backup of all issues...')
    
    // Fetch all issues
    const { data: issues, error } = await supabase
      .from('issues')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('❌ Error fetching issues:', error)
      throw error
    }
    
    if (!issues || issues.length === 0) {
      console.log('ℹ️ No issues found in database')
      return
    }
    
    // Create backup filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
    const backupDir = path.join(__dirname, '..', 'backups')
    const backupFile = path.join(backupDir, `issues-backup-${timestamp}.json`)
    
    // Ensure backup directory exists
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true })
    }
    
    // Write backup file
    const backupData = {
      timestamp: new Date().toISOString(),
      totalIssues: issues.length,
      issues: issues
    }
    
    fs.writeFileSync(backupFile, JSON.stringify(backupData, null, 2))
    
    console.log(`✅ Backup completed successfully!`)
    console.log(`📁 Backup saved to: ${backupFile}`)
    console.log(`📊 Total issues backed up: ${issues.length}`)
    
    // Show summary by category
    const categorySummary = issues.reduce((acc, issue) => {
      acc[issue.category] = (acc[issue.category] || 0) + 1
      return acc
    }, {})
    
    console.log('\n📈 Issues by category:')
    Object.entries(categorySummary).forEach(([category, count]) => {
      console.log(`   ${category}: ${count}`)
    })
    
    return backupFile
    
  } catch (error) {
    console.error('❌ Backup failed:', error.message)
    process.exit(1)
  }
}

// Run backup if this script is executed directly
if (require.main === module) {
  backupIssues()
    .then(() => {
      console.log('\n🎉 Backup process completed successfully')
      process.exit(0)
    })
    .catch((error) => {
      console.error('\n💥 Backup process failed:', error)
      process.exit(1)
    })
}

module.exports = { backupIssues }
