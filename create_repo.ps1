<#
create_repo.ps1

Helper to create a GitHub repo and push the current project.
Usage: Run this from the project root in PowerShell. The script will
use `gh` if available; otherwise it asks for a remote URL to add.
#>

param(
    [string]$RepoName = "CyberDefenceExamApp",
    [switch]$Private
)

function Has-Gh {
    try {
        gh --version > $null 2>&1
        return $true
    } catch {
        return $false
    }
}

if (Has-Gh) {
    Write-Host "gh CLI found — creating repository: $RepoName"
    $priv = $Private.IsPresent ? "--private" : "--public"
    gh repo create $RepoName $priv --source=. --remote=origin --push
    if ($LASTEXITCODE -ne 0) { Write-Error "Failed to create or push via gh."; exit 1 }
    Write-Host "Repository created and pushed. Creating gh-pages branch..."
    git checkout -b gh-pages
    git push -u origin gh-pages
    Write-Host "gh-pages branch pushed. Enable Pages in repository settings if needed."
    exit 0
}

Write-Host "gh CLI not found. Please create a repository on GitHub (via web UI) named: $RepoName"
$remote = Read-Host "Paste the git remote URL (HTTPS or SSH)"
if (![string]::IsNullOrWhiteSpace($remote)) {
    git remote add origin $remote
    git branch -M main
    git push -u origin main
    Write-Host "Main branch pushed. Creating and pushing gh-pages branch..."
    git checkout -b gh-pages
    git push -u origin gh-pages
    Write-Host "Done. Visit your repository settings → Pages to enable the site."
} else {
    Write-Host "No remote provided. Script finished without pushing."
}
