$pptxPath = (Resolve-Path "AI_Assisted_Recruitment_System_Review.pptx").Path
$outDir = Join-Path (Get-Location) "review_slides_img"
if (!(Test-Path $outDir)) {
    New-Item -ItemType Directory -Path $outDir | Out-Null
}

$ppt = New-Object -ComObject PowerPoint.Application
$pres = $ppt.Presentations.Open($pptxPath, 2, 0, 0)
$pres.SaveAs($outDir, 18)
$pres.Close()
$ppt.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($ppt) | Out-Null

Write-Host "SUCCESS: Re-exported slides to $outDir"
