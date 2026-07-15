$svcs = Get-Service | Where-Object { $_.Name -like '*mysql*' -or $_.DisplayName -like '*mysql*' -or $_.Name -like '*mariadb*' -or $_.DisplayName -like '*mariadb*' }
if (!$svcs) {
    Write-Output 'NoMySQLServiceFound'
    exit 0
}
Write-Output "Found:$($svcs.Count)"
$svcs | Select-Object Name,DisplayName,Status | ConvertTo-Json -Depth 2
foreach ($s in $svcs) {
    $name = $s.Name
    $status = $s.Status
    if ($status -ne 'Running') {
        try {
            Start-Service -Name $name -ErrorAction Stop
            Write-Output "Started:$name"
        } catch {
            Write-Output ("FailedStart:{0}:{1}" -f $name, $_.Exception.Message)
        }
    } else {
        Write-Output "AlreadyRunning:$name"
    }
}
