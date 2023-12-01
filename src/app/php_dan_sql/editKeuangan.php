<?php
require 'koneksi.php';
$input = file_get_contents('php://input');
$data = json_decode($input, true);
//terima data dari mobile
$id = trim($data['id']);
$deskripsi = trim($data['deskripsi']);
$total = trim($data['total']);
http_response_code(201);
if ($deskripsi != '' and $total != '') {
    $query = mysqli_query($koneksi, "update keuangan set deskripsi='$deskripsi',total='$total' where 
id='$id'");
    $pesan = true;
} else {
    $pesan = false;
}
echo json_encode($pesan);
echo mysqli_error($koneksi);