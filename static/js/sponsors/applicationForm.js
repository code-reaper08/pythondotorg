$(document).ready(function(){
    const SELECTORS = {
        checkboxesContainer: () => $('#benefits_container'),
        costLabel:  () => $("#cost_label"),
        clearFormBtn:  () => $("#clear_form_btn"),
        packageInput:  () => $("input[name=package]"),
        applicationForm:  () => $("#application_form"),
        getPackageInfo: (packageId) => $("#package_benefits_" + packageId),
        getPackageBenefits: (packageId) => SELECTORS.getPackageInfo(packageId).children(),
        benefitsInputs: () => $("input[id^=id_benefits_]"),
        getBenefitLabel: (benefitId) => $('label[benefit_id=' + benefitId + ']'),
        getBenefitInput: (benefitId) => SELECTORS.benefitsInputs().filter('[value=' + benefitId + ']'),
        getBenefitConflicts: (benefitId) => $('#conflicts_with_' + benefitId).children(),
        getSelectedBenefits: () => SELECTORS.benefitsInputs().filter(":checked"),
    }

    displayPackageCost = (packageId) => {
      let packageInfo = SELECTORS.getPackageInfo(packageId);
      let cost = packageInfo.attr("data-cost");
      SELECTORS.costLabel().html('Sponsorship cost is $' + cost.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' USD')
    }



    SELECTORS.clearFormBtn().click(function(){
        SELECTORS.applicationForm().trigger("reset");
        SELECTORS.applicationForm().find("[class=active]").removeClass("active");
        SELECTORS.packageInput().prop("checked", false);
        SELECTORS.checkboxesContainer().find(':checkbox').each(function(){
            $(this).prop('checked', false);
            if ($(this).attr("package_only")) $(this).attr("disabled", true);
        });
        SELECTORS.costLabel().html("");
    });

    SELECTORS.packageInput().change(function(){
      let package = this.value;
      if (package.length == 0) return;

      SELECTORS.costLabel().html("Updating cost...")

      SELECTORS.checkboxesContainer().find(':checkbox').each(function(){
          $(this).prop('checked', false);
          let packageOnlyBenefit = $(this).attr("package_only");
          if (packageOnlyBenefit) $(this).attr("disabled", true);
      });

      SELECTORS.getPackageBenefits(package).each(function(){
          let benefit = $(this).html()
          let benefitInput = SELECTORS.getBenefitInput(benefit);
          let packageOnlyBenefit = benefitInput.attr("package_only");
          benefitInput.removeAttr("disabled");
          benefitInput.trigger("click");
      });
      displayPackageCost(package);
    });

    SELECTORS.benefitsInputs().change(function(){
      let benefit = this.value;
      if (benefit.length == 0) return;

      // display package cost if custom benefit change result matches with package's benefits list
      let isChangeFromPackageChange = SELECTORS.costLabel().html() == "Updating cost..."
      if (!isChangeFromPackageChange) {
        let selectedBenefits = SELECTORS.getSelectedBenefits();
        selectedBenefits = $.map(selectedBenefits, (b) => $(b).val()).sort();
        let selectedPackageId = SELECTORS.packageInput().filter(":checked").val()
        let packageBenefits = SELECTORS.getPackageBenefits(selectedPackageId);
        packageBenefits = $.map(packageBenefits, (b) => $(b).text()).sort();

        // check same num of benefits and join with string. if same string, both lists have the same benefits
        if (packageBenefits.length == selectedBenefits.length && packageBenefits.join(',') === selectedBenefits.join(',')){
            displayPackageCost(selectedPackageId);
        } else {
            let msg = "Please submit your customized sponsorship package application and we'll contact you within 2 business days.";
            SELECTORS.costLabel().html(msg);
        }
      }

      // updates the input to be active if needed
      let active = SELECTORS.getBenefitInput(benefit).prop("checked");
      if (!active) {
          return;
      } else {
          SELECTORS.getBenefitLabel(benefit).addClass("active");
      }

      // check and ensure conflicts constraints between checked benefits
      SELECTORS.getBenefitConflicts(benefit).each(function(){
          let conflictId = $(this).html();
          let checked = SELECTORS.getBenefitInput(conflictId).prop("checked");
          if (checked){
            conflictCheckbox.trigger("click");
            conflictCheckbox.parent().removeClass("active");
          }
      });
    });

  $(document).tooltip({
    show: { effect: "blind", duration: 0 },
    hide: false
  });
});
