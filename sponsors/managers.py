from django.db.models import Count
from ordered_model.models import OrderedModelManager
from django.db.models import Q, Subquery
from django.db.models.query import QuerySet


class SponsorshipQuerySet(QuerySet):
    def in_progress(self):
        status = [self.model.APPLIED, self.model.APPROVED]
        return self.filter(status__in=status)

    def approved(self):
        return self.filter(status=self.model.APPROVED)

    def visible_to(self, user):
        contacts = user.sponsorcontact_set.values_list('sponsor_id', flat=True)
        status = [self.model.APPLIED, self.model.APPROVED, self.model.FINALIZED]
        return self.filter(
            Q(submited_by=user) | Q(sponsor_id__in=Subquery(contacts)),
            status__in=status,
        ).select_related('sponsor')

    def finalized(self):
        return self.filter(status=self.model.FINALIZED)


class SponsorContactQuerySet(QuerySet):
    def get_primary_contact(self, sponsor):
        contact = self.filter(sponsor=sponsor, primary=True).first()
        if not contact:
            raise self.model.DoesNotExist()
        return contact


class SponsorshipBenefitManager(OrderedModelManager):
    def with_conflicts(self):
        return self.exclude(conflicts__isnull=True)

    def without_conflicts(self):
        return self.filter(conflicts__isnull=True)

    def add_ons(self):
        return self.annotate(num_packages=Count("packages")).filter(num_packages=0)

    def with_packages(self):
        return (
            self.annotate(num_packages=Count("packages"))
            .exclude(num_packages=0)
            .order_by("-num_packages")
        )
