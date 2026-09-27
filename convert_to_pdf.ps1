$htmlPath = "C:\Users\sreed\.gemini\antigravity\scratch\vlsi-ai-analyzer\readme_export.html"
$pdfPath = "C:\Users\sreed\Downloads\VLSI_AI_Analyzer_README.pdf"

Write-Host "Initializing Word automation engine..."
$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = [Microsoft.Office.Interop.Word.WdAlertLevel]::wdAlertsNone

try {
    Write-Host "Opening HTML source document: $htmlPath"
    $doc = $word.Documents.Open($htmlPath, $false, $true)
    
    # 17 = wdFormatPDF
    Write-Host "Exporting to PDF: $pdfPath"
    $doc.SaveAs([ref]$pdfPath, [ref]17)
    $doc.Close([ref]$false)
    Write-Host "PDF successfully generated!"
}
catch {
    Write-Error "Error during PDF export: $_"
}
finally {
    $word.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) | Out-Null
}
