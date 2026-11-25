import organizationModel from "../models/organizationModel.js";

// getOrgId resolves the organization that owns the requested resource,
// or undefined when the resource itself doesn't exist.
function requireOrgAccess(getOrgId) {
  return async (req, res, next) => {
    const orgId = await getOrgId(req);
    if (!orgId) {
      return res.status(404).json({ message: "Not found" });
    }

    const organization = await organizationModel.findById(orgId);
    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    const isMember = organization.members.some(
      (memberId) => memberId?.toString() === req.userId,
    );
    if (!isMember) {
      return res
        .status(403)
        .json({ message: "You are not a member of this organization" });
    }

    req.org = organization;
    next();
  };
}

export const orgFromParam = (req) => req.params.organizationId;

export default requireOrgAccess;
