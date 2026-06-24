output "ec2_public_ip" {
  description = "Public IP of Harry Potter server"
  value       = aws_instance.harry_server.public_ip
}

output "app_url" {
  description = "Harry Potter App URL"
  value       = "http://${aws_instance.harry_server.public_ip}"
}

output "ssh_command" {
  description = "SSH command"
  value       = "ssh -i ${var.key_name}.pem ubuntu@${aws_instance.harry_server.public_ip}"
}
