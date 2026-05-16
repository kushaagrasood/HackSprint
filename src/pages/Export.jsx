import { useMemo, useState } from 'react'
import { Download, FileJson, FileSpreadsheet, FileText, Loader2 } from 'lucide-react'
import { useHackSprint } from '@context/HackSprintContext'
import { downloadFile } from '@utils/helpers'
import { loadExcelJS } from '@utils/exceljs'

function ExportPage() {
  const { activeProject, projectOverview, tasks, checklist } = useHackSprint()
  const [exportingFormat, setExportingFormat] = useState(null)
  const [error, setError] = useState('')

  const exportData = useMemo(() => {
    const title = projectOverview.title || activeProject?.title || 'hacksprint-project'
    const generatedAt = new Date().toISOString()

    return {
      meta: {
        title,
        description: projectOverview.description || '',
        status: projectOverview.status || activeProject?.status || 'planning',
        generatedAt,
      },
      tasks: tasks.map((task) => ({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'todo',
        priority: task.priority || 'medium',
        dueDate: task.due_date || task.dueDate || '',
        createdAt: task.created_at || '',
        updatedAt: task.updated_at || '',
      })),
      checklist: checklist.map((item) => ({
        title: item.title || item.name || '',
        completed: Boolean(item.completed),
        order: item.order ?? 0,
        createdAt: item.created_at || '',
        updatedAt: item.updated_at || '',
      })),
    }
  }, [activeProject, checklist, projectOverview, tasks])

  const baseFilename = useMemo(() => {
    const rawTitle = exportData.meta.title || 'hacksprint-project'
    return rawTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'hacksprint-project'
  }, [exportData.meta.title])

  const hasProjectData = Boolean(activeProject || tasks.length || checklist.length || projectOverview.title)

  const exportAsJson = () => {
    downloadFile(
      JSON.stringify(exportData, null, 2),
      `${baseFilename}.json`,
      'application/json'
    )
  }

  const exportAsCsv = () => {
    const rows = [
      ['Type', 'Title', 'Description', 'Status', 'Priority', 'Completed', 'Due Date', 'Created At', 'Updated At'],
      ...exportData.tasks.map((task) => [
        'Task',
        task.title,
        task.description,
        task.status,
        task.priority,
        '',
        task.dueDate,
        task.createdAt,
        task.updatedAt,
      ]),
      ...exportData.checklist.map((item) => [
        'Checklist',
        item.title,
        '',
        '',
        '',
        item.completed ? 'Yes' : 'No',
        '',
        item.createdAt,
        item.updatedAt,
      ]),
    ]

    const csv = rows
      .map((row) =>
        row
          .map((cell) => `"${String(cell ?? '').replaceAll('"', '""')}"`)
          .join(',')
      )
      .join('\n')

    downloadFile(csv, `${baseFilename}.csv`, 'text/csv;charset=utf-8')
  }

  const exportAsMarkdown = () => {
    const markdown = [
      `# ${exportData.meta.title}`,
      '',
      exportData.meta.description || 'No project description provided.',
      '',
      `- Status: ${exportData.meta.status}`,
      `- Generated At: ${exportData.meta.generatedAt}`,
      '',
      '## Tasks',
      '',
      ...(exportData.tasks.length
        ? exportData.tasks.map(
            (task) =>
              `- **${task.title || 'Untitled task'}** | status: ${task.status} | priority: ${task.priority}${task.description ? ` | ${task.description}` : ''}`
          )
        : ['- No tasks available.']),
      '',
      '## Checklist',
      '',
      ...(exportData.checklist.length
        ? exportData.checklist.map(
            (item) => `- [${item.completed ? 'x' : ' '}] ${item.title || 'Untitled item'}`
          )
        : ['- No checklist items available.']),
      '',
    ].join('\n')

    downloadFile(markdown, `${baseFilename}.md`, 'text/markdown;charset=utf-8')
  }

  const exportAsExcel = async () => {
    const ExcelJS = await loadExcelJS()
    const workbook = new ExcelJS.Workbook()
    workbook.creator = 'HackSprint'
    workbook.created = new Date()

    const summarySheet = workbook.addWorksheet('Summary')
    summarySheet.columns = [
      { header: 'Field', key: 'field', width: 22 },
      { header: 'Value', key: 'value', width: 50 },
    ]
    summarySheet.addRows([
      { field: 'Project Title', value: exportData.meta.title },
      { field: 'Description', value: exportData.meta.description || 'N/A' },
      { field: 'Status', value: exportData.meta.status },
      { field: 'Generated At', value: exportData.meta.generatedAt },
      { field: 'Tasks', value: exportData.tasks.length },
      { field: 'Checklist Items', value: exportData.checklist.length },
    ])

    const tasksSheet = workbook.addWorksheet('Tasks')
    tasksSheet.columns = [
      { header: 'Title', key: 'title', width: 28 },
      { header: 'Description', key: 'description', width: 40 },
      { header: 'Status', key: 'status', width: 16 },
      { header: 'Priority', key: 'priority', width: 14 },
      { header: 'Due Date', key: 'dueDate', width: 22 },
      { header: 'Created At', key: 'createdAt', width: 28 },
      { header: 'Updated At', key: 'updatedAt', width: 28 },
    ]
    tasksSheet.addRows(exportData.tasks)

    const checklistSheet = workbook.addWorksheet('Checklist')
    checklistSheet.columns = [
      { header: 'Title', key: 'title', width: 32 },
      { header: 'Completed', key: 'completed', width: 14 },
      { header: 'Order', key: 'order', width: 10 },
      { header: 'Created At', key: 'createdAt', width: 28 },
      { header: 'Updated At', key: 'updatedAt', width: 28 },
    ]
    checklistSheet.addRows(
      exportData.checklist.map((item) => ({
        ...item,
        completed: item.completed ? 'Yes' : 'No',
      }))
    )

    const buffer = await workbook.xlsx.writeBuffer()
    downloadFile(
      buffer,
      `${baseFilename}.xlsx`,
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
  }

  const handleExport = async (format) => {
    setExportingFormat(format)
    setError('')

    try {
      if (format === 'json') exportAsJson()
      if (format === 'csv') exportAsCsv()
      if (format === 'markdown') exportAsMarkdown()
      if (format === 'excel') await exportAsExcel()
    } catch (exportError) {
      setError(exportError.message || 'Export failed')
    } finally {
      setExportingFormat(null)
    }
  }

  const exportCards = [
    {
      id: 'excel',
      title: 'Excel Workbook',
      description: 'Exports project summary, tasks, and checklist into separate worksheets.',
      icon: FileSpreadsheet,
      accent: 'from-emerald-500 to-green-600',
    },
    {
      id: 'csv',
      title: 'CSV',
      description: 'Exports tasks and checklist rows in a flat spreadsheet-friendly format.',
      icon: FileSpreadsheet,
      accent: 'from-sky-500 to-blue-600',
    },
    {
      id: 'json',
      title: 'JSON',
      description: 'Exports the full project payload for backup or API reuse.',
      icon: FileJson,
      accent: 'from-violet-500 to-indigo-600',
    },
    {
      id: 'markdown',
      title: 'Markdown',
      description: 'Exports a readable project snapshot for docs and submissions.',
      icon: FileText,
      accent: 'from-amber-500 to-orange-600',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="card overflow-hidden bg-slate-900 text-white">
        <div className="bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.35),_transparent_35%),linear-gradient(135deg,_#0f172a,_#111827_55%,_#1e293b)] p-8">
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-sky-300">
              Export Center
            </p>
            <h1 className="text-3xl font-bold">Generate clean handoff files from your project data</h1>
            <p className="mt-3 text-sm text-slate-200 sm:text-base">
              `xlsx` has been removed from this app. Excel exports now use ExcelJS from a CDN at runtime,
              while CSV, JSON, and Markdown exports are generated locally in the browser.
            </p>
          </div>
        </div>
      </div>

      {!hasProjectData && (
        <div className="card border border-amber-200 bg-amber-50">
          <p className="text-sm text-amber-900">
            No project data is loaded yet. Exports will work once you create a project or sync one from Supabase.
          </p>
        </div>
      )}

      {error && (
        <div className="card border border-error-200 bg-error-50">
          <p className="text-sm text-error-700">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {exportCards.map((card) => {
          const Icon = card.icon
          const isBusy = exportingFormat === card.id

          return (
            <div key={card.id} className="card border border-gray-200">
              <div className={`mb-5 inline-flex rounded-2xl bg-gradient-to-br ${card.accent} p-3 text-white shadow-lg`}>
                <Icon className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">{card.title}</h2>
              <p className="mt-2 text-sm text-gray-600">{card.description}</p>
              <button
                type="button"
                onClick={() => handleExport(card.id)}
                disabled={isBusy}
                className="btn btn-primary mt-6 w-full gap-2"
              >
                {isBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                {isBusy ? 'Preparing export...' : `Download ${card.title}`}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ExportPage
