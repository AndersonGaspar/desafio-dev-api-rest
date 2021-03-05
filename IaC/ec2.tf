resource "aws_key_pair" "dock-testing" {
  key_name   = "key_dock"
  public_key = file("key.pub")
}

resource "aws_instance" "dock-testing" {
  key_name      = aws_key_pair.dock.key_name
  ami           = "ami-047a51fa27710816e"
  instance_type = "t2.small"

  tags = {
    Name = "dock"
    Env = "dev"
  }

  vpc_security_group_ids = [
    aws_security_group.dock.id
  ]

  connection {
    type        = "ssh"
    user        = "ec2-user"
    private_key = file("key.pub")
    host        = self.public_ip
  }

  ebs_block_device {
    device_name = "/dev/sda1"
    volume_type = "gp2"
    volume_size = 30
  }

  provisioner "local-exec" {
    command = "echo ${aws_instance.dock.public_ip} >> ./Jenkins/hosts"
  }
}

resource "aws_eip" "dock" {
  vpc      = true
  instance = aws_instance.dock.id
}