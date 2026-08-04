import organizationModel from "../models/organizationModel.js";

function requireOrgAccess(getOrgId) {
  return async (req, res, next) => {
    try {
      const orgId = await getOrgId(req);

      const organization = await organizationModel.findById(orgId);
      if (!organization) {
        return res.status(404).send({ message: "organization not found" });
      }

      const memberExists = organization.members.some(
        (memberId) => memberId?.toString() === req.userId,
      );

      if (!memberExists) {
        return res.status(400).json({ message: "Member does not exists" });
      }
      req.org = organization;

      next();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
}
export default requireOrgAccess;