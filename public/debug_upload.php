<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    echo "<pre>";
    print_r($_FILES);
    if (isset($_FILES['file'])) {
        $tmpName = $_FILES['file']['tmp_name'];
        echo "Temp File: " . $tmpName . "\n";
        echo "Exists: " . (file_exists($tmpName) ? 'YES' : 'NO') . "\n";
        echo "Readable: " . (is_readable($tmpName) ? 'YES' : 'NO') . "\n";
        echo "Size: " . filesize($tmpName) . "\n";
        echo "Upload Error: " . $_FILES['file']['error'] . "\n";
    }
    echo "</pre>";
    exit;
}
?>
<!DOCTYPE html>
<html>

<body>
    <form method="post" enctype="multipart/form-data">
        <input type="file" name="file">
        <button type="submit">Upload</button>
    </form>
</body>

</html>