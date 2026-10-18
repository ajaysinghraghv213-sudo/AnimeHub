from django.core.mail import send_mail
from celery import shared_task
from .models import EmailUs


@shared_task
def send_otp_email(subject, message, from_email, recipient_list):
    send_mail(subject, message, from_email, recipient_list)

@shared_task
def send_email_us(name, email, send_to, subject, message):

    try:
        send_mail(
            subject,
            message,
            email,
            [send_to]
        )
        EmailUs.objects.create(
            name=name,
            email=email,
            send_to=send_to,
            subject=subject,
            message=message
        )
        return True
    except Exception as e:
        return False 

@shared_task
def send_get_new_updates(email,subject,message,from_email):
    try:
        send_mail(subject, message, from_email, [email])
        return True
    except Exception as e:
        return False