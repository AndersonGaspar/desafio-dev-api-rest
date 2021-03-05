output "public_ip"{
  value = "${aws_instance.dock.*.public_ip}"
}