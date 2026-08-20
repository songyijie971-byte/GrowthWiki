param(
  [Parameter(Position = 0, Mandatory = $true)]
  [string]$Mode,
  [Parameter(Position = 1, Mandatory = $true)]
  [string]$Archive,
  [Parameter(Position = 2)]
  [string]$Entry
)

Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::OpenRead($Archive)
try {
  if ($Mode -eq '-Z1') {
    [Console]::OutputEncoding = [System.Text.UTF8Encoding]::new($false)
    foreach ($item in $zip.Entries) {
      [Console]::Out.WriteLine($item.FullName)
    }
    exit 0
  }

  if ($Mode -eq '-p') {
    $item = $zip.Entries | Where-Object { $_.FullName -eq $Entry } | Select-Object -First 1
    if ($null -eq $item) { exit 11 }
    $inputStream = $item.Open()
    try {
      $outputStream = [Console]::OpenStandardOutput()
      $inputStream.CopyTo($outputStream)
      $outputStream.Flush()
    }
    finally {
      $inputStream.Dispose()
    }
    exit 0
  }

  exit 2
}
finally {
  $zip.Dispose()
}
