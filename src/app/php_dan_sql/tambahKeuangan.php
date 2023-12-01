<?php
require 'koneksi.php';
$input = file_get_contents('php://input');
$data = json_decode($input, true);
//terima data dari mobile
$jenis = trim($data['jenis']);
$total = trim($data['total']);
$deskripsi = trim($data['deskripsi']);
http_response_code(201);
if ($jenis != '' and $total != 0 and $deskripsi != '' ) {
    $query = mysqli_query($koneksi, "insert into keuangan(jenis,total,deskripsi) values('$jenis','$total','$deskripsi')");
    $pesan = true;
} else {
    $pesan = false;
}
echo json_encode($pesan);
echo mysqli_error($koneksi);
